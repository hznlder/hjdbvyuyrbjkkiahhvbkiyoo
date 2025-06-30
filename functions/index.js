const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// Cloud Function to monitor new codes and send push notifications
exports.checkForNewCodes = functions.pubsub.schedule('every 30 minutes').onRun(async (context) => {
    try {
        // Fetch codes from the API
        const response = await axios.get('https://db.hashblen.com/codes');
        const currentCodes = response.data;
        
        // Get the last known codes from Firestore
        const lastCodesDoc = await admin.firestore().collection('system').doc('lastKnownCodes').get();
        const lastKnownCodes = lastCodesDoc.exists ? lastCodesDoc.data() : {};
        
        // Check for new codes
        const newCodes = {};
        for (const game in currentCodes) {
            if (currentCodes[game] && Array.isArray(currentCodes[game])) {
                const lastGameCodes = lastKnownCodes[game] || [];
                const currentGameCodes = currentCodes[game];
                
                // Find new codes by comparing code values
                const newGameCodes = currentGameCodes.filter(currentCode => 
                    !lastGameCodes.some(lastCode => lastCode.code === currentCode.code)
                );
                
                if (newGameCodes.length > 0) {
                    newCodes[game] = newGameCodes;
                }
            }
        }
        
        // If there are new codes, send notifications
        if (Object.keys(newCodes).length > 0) {
            await sendNotificationsForNewCodes(newCodes);
            
            // Update last known codes
            await admin.firestore().collection('system').doc('lastKnownCodes').set(currentCodes);
        }
        
        console.log('Code check completed successfully');
        return null;
    } catch (error) {
        console.error('Error checking for new codes:', error);
        return null;
    }
});

async function sendNotificationsForNewCodes(newCodes) {
    try {
        // Get all users with notification preferences
        const usersSnapshot = await admin.firestore().collection('users').get();
        
        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const { favoriteGames, notifications, fcmToken } = userData;
            
            // Skip if user doesn't have notifications enabled or no FCM token
            if (!notifications?.newCodes || !fcmToken) continue;
            
            // Check if user should receive notifications for these games
            const relevantGames = notifications.favoritesOnly 
                ? Object.keys(newCodes).filter(game => favoriteGames?.includes(game))
                : Object.keys(newCodes);
            
            if (relevantGames.length === 0) continue;
            
            // Create notification message
            const gameNames = {
                genshin: 'Genshin Impact',
                hsr: 'Honkai: Star Rail',
                zzz: 'Zenless Zone Zero'
            };
            
            const gameList = relevantGames.map(game => gameNames[game]).join(', ');
            const codeCount = relevantGames.reduce((total, game) => total + newCodes[game].length, 0);
            
            const message = {
                token: fcmToken,
                notification: {
                    title: '🎮 New Redemption Codes Available!',
                    body: `${codeCount} new code${codeCount > 1 ? 's' : ''} for ${gameList}`,
                    icon: '/images/icon-192x192.png'
                },
                data: {
                    games: relevantGames.join(','),
                    url: 'https://your-domain.com'
                },
                webpush: {
                    fcm_options: {
                        link: 'https://your-domain.com'
                    }
                }
            };
            
            try {
                await admin.messaging().send(message);
                console.log(`Notification sent to user ${userDoc.id}`);
            } catch (error) {
                console.error(`Failed to send notification to user ${userDoc.id}:`, error);
                
                // If token is invalid, remove it
                if (error.code === 'messaging/registration-token-not-registered') {
                    await admin.firestore().collection('users').doc(userDoc.id).update({
                        fcmToken: admin.firestore.FieldValue.delete()
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
}

// Cloud Function to handle code voting
exports.voteOnCode = functions.https.onCall(async (data, context) => {
    // Verify user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    
    const { codeId, voteType, game } = data;
    const userId = context.auth.uid;
    
    if (!codeId || !voteType || !game || !['upvote', 'downvote'].includes(voteType)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid vote data');
    }
    
    try {
        const voteRef = admin.firestore().collection('votes').doc(`${game}_${codeId}_${userId}`);
        const voteDoc = await voteRef.get();
        
        if (voteDoc.exists) {
            const existingVote = voteDoc.data().voteType;
            if (existingVote === voteType) {
                // Remove vote if clicking same button
                await voteRef.delete();
                return { success: true, action: 'removed', voteType };
            } else {
                // Update vote if different
                await voteRef.update({ voteType, timestamp: admin.firestore.FieldValue.serverTimestamp() });
                return { success: true, action: 'updated', voteType };
            }
        } else {
            // Create new vote
            await voteRef.set({
                userId,
                codeId,
                game,
                voteType,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, action: 'created', voteType };
        }
    } catch (error) {
        console.error('Error handling vote:', error);
        throw new functions.https.HttpsError('internal', 'Failed to process vote');
    }
});

// Cloud Function to get vote counts for codes
exports.getVoteCounts = functions.https.onCall(async (data, context) => {
    const { game, codeIds } = data;
    
    if (!game || !Array.isArray(codeIds)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid request data');
    }
    
    try {
        const voteCounts = {};
        
        for (const codeId of codeIds) {
            const votesSnapshot = await admin.firestore()
                .collection('votes')
                .where('game', '==', game)
                .where('codeId', '==', codeId)
                .get();
            
            let upvotes = 0;
            let downvotes = 0;
            
            votesSnapshot.forEach(doc => {
                const vote = doc.data();
                if (vote.voteType === 'upvote') upvotes++;
                else if (vote.voteType === 'downvote') downvotes++;
            });
            
            voteCounts[codeId] = { upvotes, downvotes };
        }
        
        return voteCounts;
    } catch (error) {
        console.error('Error getting vote counts:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get vote counts');
    }
});

// Cloud Function to handle code reports
exports.reportCode = functions.https.onCall(async (data, context) => {
    // Verify user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    
    const { codeId, game, reason } = data;
    const userId = context.auth.uid;
    
    if (!codeId || !game) {
        throw new functions.https.HttpsError('invalid-argument', 'Code ID and game are required');
    }
    
    try {
        await admin.firestore().collection('reports').add({
            userId,
            codeId,
            game,
            reason: reason || 'No reason provided',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        });
        
        return { success: true, message: 'Report submitted successfully' };
    } catch (error) {
        console.error('Error submitting report:', error);
        throw new functions.https.HttpsError('internal', 'Failed to submit report');
    }
});

// Cloud Function to handle comments
exports.addComment = functions.https.onCall(async (data, context) => {
    // Verify user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    
    const { game, comment } = data;
    const userId = context.auth.uid;
    
    if (!game || !comment || comment.trim().length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Game and comment are required');
    }
    
    if (comment.length > 500) {
        throw new functions.https.HttpsError('invalid-argument', 'Comment too long (max 500 characters)');
    }
    
    try {
        // Get user email for display
        const userRecord = await admin.auth().getUser(userId);
        
        const commentDoc = await admin.firestore().collection('comments').add({
            userId,
            userEmail: userRecord.email,
            game,
            comment: comment.trim(),
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        
        return { 
            success: true, 
            commentId: commentDoc.id,
            userEmail: userRecord.email,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error adding comment:', error);
        throw new functions.https.HttpsError('internal', 'Failed to add comment');
    }
});

// Cloud Function to get comments for a game
exports.getComments = functions.https.onCall(async (data, context) => {
    const { game, limit = 20 } = data;
    
    if (!game) {
        throw new functions.https.HttpsError('invalid-argument', 'Game is required');
    }
    
    try {
        const commentsSnapshot = await admin.firestore()
            .collection('comments')
            .where('game', '==', game)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        
        const comments = [];
        commentsSnapshot.forEach(doc => {
            const data = doc.data();
            comments.push({
                id: doc.id,
                userEmail: data.userEmail,
                comment: data.comment,
                timestamp: data.timestamp?.toDate()?.toISOString() || new Date().toISOString()
            });
        });
        
        return comments;
    } catch (error) {
        console.error('Error getting comments:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get comments');
    }
});

