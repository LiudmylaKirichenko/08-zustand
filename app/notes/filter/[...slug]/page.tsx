import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function NotesSlugPage({ params }: Props) {
  const slug = (await params).slug || [];

  let tag: string | undefined = undefined;

  if (slug.length > 0 && slug[0].toLowerCase() !== "all") {
    tag = slug[0];
  }

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["notes", tag, "", 1],
      queryFn: () =>
        fetchNotes({
          tag: tag && tag.toLowerCase() !== "all" ? tag : undefined,
          search: "",
          page: 1,
        }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
      <HydrationBoundary state={dehydratedState}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    );
  } catch (error) {
    console.log("Error fetching notes:", error);
    return (
      <div>
        <p>Something went wrong while fetching the notes.</p>
      </div>
    );
  }
}
