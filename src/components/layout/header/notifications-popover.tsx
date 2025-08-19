
'use client';

import { Bell, CheckCircle, Clock, MessageSquare, Gift, Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
// Removed Firebase imports for demo mode
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Mock notification data for demo mode
const mockNotifications = [
  {
    id: '1',
    type: 'New Message',
    message: 'You have a new message from Sunset Gardens',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    iconName: 'New Message'
  },
  {
    id: '2',
    type: 'Booking Confirmed',
    message: 'Your booking for Grand Hotel Ballroom has been confirmed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    iconName: 'Booking Confirmed'
  },
  {
    id: '3',
    type: 'Review Reminder',
    message: 'Don\'t forget to review your recent event at Industrial Loft',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    iconName: 'Review Reminder'
  }
];

interface Notification {
    id: string;
    type: string;
    message: string;
    timestamp: Date; // Changed from Timestamp to Date for demo mode
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

function useNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // Mock notifications for demo mode
        setNotifications(mockNotifications);
        setLoading(false);
    }, [user]);

    const markAllAsRead = async () => {
        if (!user) return;
        const unreadNotifs = notifications.filter(n => !n.read);
        if (unreadNotifs.length === 0) return;

        try {
            // Mock update for demo mode
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    }

    return { notifications, loading, markAllAsRead };
}

const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div className="flex items-start gap-3 p-3 hover:bg-muted/50">
        <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
            {iconMap[notification.iconName] || iconMap['Default']}
        </div>
        <div className="flex-1">
            <p className="font-semibold text-xs">{notification.type}</p>
            <p className="text-xs text-muted-foreground">
                {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
            </p>
        </div>
        {!notification.read && (
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
        )}
    </div>
);

export function NotificationsPopover() {
    const { notifications, loading, markAllAsRead } = useNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-primary">
                        {unreadCount}
                    </Badge>
                )}
            </Button>
            
            <div className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-lg shadow-lg z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <Card className="border-0 shadow-none">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Notifications</CardTitle>
                            {unreadCount > 0 && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={markAllAsRead}
                                    className="text-xs"
                                >
                                    Mark all as read
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Tabs defaultValue="all" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all" className="mt-0">
                                {loading ? (
                                    <div className="flex items-center justify-center p-6">
                                        <Loader className="w-5 h-5 animate-spin" />
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-6 text-center text-muted-foreground">
                                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No notifications yet</p>
                                    </div>
                                ) : (
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <NotificationItem key={notification.id} notification={notification} />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="unread" className="mt-0">
                                {loading ? (
                                    <div className="flex items-center justify-center p-6">
                                        <Loader className="w-5 h-5 animate-spin" />
                                    </div>
                                ) : unreadCount === 0 ? (
                                    <div className="p-6 text-center text-muted-foreground">
                                        <Check className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">All caught up!</p>
                                    </div>
                                ) : (
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications
                                            .filter(n => !n.read)
                                            .map((notification) => (
                                                <NotificationItem key={notification.id} notification={notification} />
                                            ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
