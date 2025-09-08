import { Metadata } from 'next';
import PhotoEditorClient from './_components/PhotoEditorClient';

export const metadata: Metadata = {
  title: 'Photo Editor - Like Butter Studio',
  description: 'Edit your photos with AI-powered tools and filters',
};

export default function PhotoEditorPage() {
  return <PhotoEditorClient />;
}
