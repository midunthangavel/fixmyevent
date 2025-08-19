import { redirect } from 'next/navigation';

export default function RootPage() {
  // For now, redirect to role selection
  // In a real app, you'd check the user's role here
  redirect('/role-selection');
}
