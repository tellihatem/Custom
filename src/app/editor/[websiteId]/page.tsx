import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/server/http';
import { HttpError } from '@/server/errors';
import { getWebsite } from '@/server/services/websiteService';
import { EditorClient } from '@/components/editor/EditorClient';
import type { Website } from '@/lib/types';

type Props = { params: Promise<{ websiteId: string }> };

export default async function EditorPage({ params }: Props) {
    const { websiteId } = await params;

    const user = await getAuthenticatedUser();
    if (!user) redirect(`/login?redirectTo=/editor/${encodeURIComponent(websiteId)}`);

    let website;
    try {
        website = await getWebsite(user.id, websiteId);
    } catch (err) {
        if (err instanceof HttpError && err.status === 404) notFound();
        throw err;
    }

    // Prisma types JSON columns as JsonValue; the editor's types describe
    // their actual shape (validated on write by the API schemas).
    return <EditorClient initialWebsite={website as unknown as Website} />;
}
