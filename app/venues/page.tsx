import { db } from '@/lib/db';
import { venues } from '@/db/schema/venues';

export default async function Page() {
  const allVenues = await db.select().from(venues);
  return (
    <ul>
      {allVenues.map((post) => (
        <li key={post.id}>
          {post.name} - {post.created_at.toString()}
        </li>
      ))}
    </ul>
  );
}
