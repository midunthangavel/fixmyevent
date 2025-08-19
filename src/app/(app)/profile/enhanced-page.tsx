import { Suspense } from 'react';
import { EnhancedProfileClient } from './enhanced-profile.client';

export default function EnhancedProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnhancedProfileClient />
    </Suspense>
  );
}
