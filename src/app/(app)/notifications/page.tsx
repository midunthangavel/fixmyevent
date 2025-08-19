
'use client';

import { PageWrapper } from "@/components/shared/page-wrapper";
import { Bell, Check, Loader, MessageSquare, Gift, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, writeBatch, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Timestamp } from 'firebase/firestore';

interface Notification {
    id: string;
    type: string;
    message: string;
    timestamp: Timestamp;
    read: boolean;
    iconName: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
    "Booking Confirmed": <CheckCircle className="w-5 h-5 text-green-500" />,
    "New Message": <MessageSquare className="w-5 h-5 text-blue-500" />,
    "Review Reminder": <Clock className="w-5 h-5 text-gray-500" />,
    "Booking Update": <Clock className="w-5 h-5 text-yellow-500" />,
    "New Idea!": <Gift className="w-5 h-5 text-pink-500" />,
    "New Review": <CheckCircle className="w-5 h-5 text-green-500" />,
    "Default": <Bell className="w-5 h-5 text-gray-500" />,
}

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'notifications'), 
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedNotifications = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Notification));
            setNotifications(fetchedNotifications);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching notifications:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const markAllAsRead = async () => {
        if (!user) return;
        const unreadNotifs = notifications.filter(n => !n.read);
        if (unreadNotifs.length === 0) return;

        const batch = writeBatch(db);
        unreadNotifs.forEach(notif => {
            const notifRef = doc(db, 'notifications', notif.id);
            batch.update(notifRef, { read: true });
        });
        await batch.commit();
    }

    const hasUnread = notifications.some(n => !n.read);

    return (
        <PageWrapper
            icon={Bell}
            title="Notifications"
            description="Here's what you've missed. Keep up to date with all your event planning activities."
        >
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-end mb-4">
                     <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={!hasUnread}>
                        <Check className="w-4 h-4 mr-2"/>
                        Mark all as read
                    </Button>
                </div>
                {loading ? (
                     <div className="flex items-center justify-center h-40">
                        <Loader className="h-8 w-8 animate-spin" />
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-3">
                        {notifications.map(notification => (
                            <div key={notification.id} className={cn("flex items-start gap-4 p-4 rounded-lg border", !notification.read && "bg-primary/5")}>
                                <div className={cn("bg-primary/10 p-2.5 rounded-full mt-1", !notification.read && "bg-primary/20")}>
                                    {iconMap[notification.iconName] || iconMap['Default']}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{notification.type}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground/80 mt-1">
                                        {notification.timestamp ? formatDistanceToNow(notification.timestamp.toDate(), { addSuffix: true }) : 'just now'}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 self-center"></div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border-dashed border rounded-lg">
                        <div className="p-8 text-center">
                            <div className="mx-auto w-fit bg-secondary p-3 rounded-full mb-3">
                            <Bell className="w-7 h-7 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">No Notifications Yet</h3>
                            <p className="text-muted-foreground text-sm">
                            Important updates about your bookings and messages will appear here.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}
