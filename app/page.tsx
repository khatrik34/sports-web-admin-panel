import { redirect } from 'next/navigation';

export default function Home() {
  // We assume the user needs to go to dashboard by default.
  // We will handle unauthenticated users at the layout or middleware level later.
  redirect('/dashboard');
}
