import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit, doc, addDoc, serverTimestamp, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logServiceError } from '@/lib/logger';
import type { Conversation, Message } from '@/ai/flows/chat.types';

export function useConversations(userId: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const initialAiConvo = useMemo(() => {
    if (!userId) return null;
    
    const initialMessage: Message = { 
      id: 'initial', 
      senderId: 'ai-assistant', 
      text: "Hello! I'm your AI event planner. How can I help you brainstorm for your next event?", 
      timestamp: Timestamp.now() 
    };
    
    return {
      id: [userId, 'ai-assistant'].sort().join('_'),
      participants: {
        [userId]: { name: 'You', avatar: '' },
        'ai-assistant': { name: 'AI Planner', avatar: '/logo.png', isAi: true },
      },
      messages: [initialMessage],
      lastMessage: initialMessage,
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !initialAiConvo) {
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    const q = query(
      collection(db, 'conversations'),
      where(`participants.${userId}.name`, '!=', null)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!isSubscribed) return;
      
      const convos: Conversation[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const lastMessage = data.lastMessage || data.messages?.[data.messages.length - 1] || null;
        convos.push({ 
          id: doc.id,
          ...data,
          lastMessage
        } as Conversation);
      });

      // Add a default AI conversation if it doesn't exist
      const hasAiConvo = convos.some(c => c.participants['ai-assistant']);
      if (!hasAiConvo) {
        convos.unshift(initialAiConvo as Conversation);
      }
      
      // Sort conversations by last message time
      convos.sort((a, b) => {
        const timeA = a.lastMessage?.timestamp?.toDate?.()?.getTime() || 0;
        const timeB = b.lastMessage?.timestamp?.toDate?.()?.getTime() || 0;
        return timeB - timeA;
      });

      setConversations(convos);
      setLoading(false);
    }, (error) => {
      if (!isSubscribed) return;
      
      logServiceError('ConversationsService', 'fetch', error, { userId });
      setLoading(false);
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [userId, initialAiConvo]);

  return { conversations, loading };
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(50));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      logServiceError('MessagesService', 'fetch', error, { conversationId });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  return { messages, loading };
}

export async function sendMessage(
  conversationId: string, 
  message: Omit<Message, 'id' | 'timestamp'>,
  updateLastMessage: boolean = true
): Promise<void> {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    const messagesRef = collection(conversationRef, 'messages');

    const messageTimestamp = serverTimestamp();
    
    // Check if conversation exists before trying to update it
    const convoSnap = await getDoc(conversationRef);
    if (convoSnap.exists()) {
      if (updateLastMessage) {
        await setDoc(conversationRef, { 
          lastMessage: { text: message.text, timestamp: messageTimestamp }, 
          updatedAt: serverTimestamp() 
        }, { merge: true });
      }
    } else {
      // Create conversation if it doesn't exist
      await setDoc(conversationRef, { 
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: { text: message.text, timestamp: messageTimestamp }
      });
    }
    
    // Add message
    await addDoc(messagesRef, { ...message, timestamp: messageTimestamp });
  } catch (error) {
    logServiceError('MessagesService', 'send', error, { conversationId, message });
    throw new Error('Failed to send message');
  }
}

export async function updateConversationLastMessage(
  conversationId: string, 
  text: string, 
  timestamp: Timestamp
): Promise<void> {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    await setDoc(conversationRef, { 
      lastMessage: { text, timestamp }, 
      updatedAt: serverTimestamp() 
    }, { merge: true });
  } catch (error) {
    logServiceError('ConversationsService', 'updateLastMessage', error, { conversationId, text });
    throw new Error('Failed to update conversation');
  }
}
