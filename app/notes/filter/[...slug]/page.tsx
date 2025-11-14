import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug || [];
  const tag =
    slug.length > 0 && slug[0].toLowerCase() !== "all" ? slug[0] : "All";

  const pageTitle = `Notes - ${tag}`;
  const pageDescription = `Filtered notes by tag: ${tag}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://notehub.com/notes/filter/${tag.toLowerCase()}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Notes preview",
        },
      ],
    },
  };
}

export default async function NotesSlugPage({ params }: Props) {
  const slug = (await params).slug || [];

  const tag =
    slug.length > 0 && slug[0].toLowerCase() !== "all" ? slug[0] : "All";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, "", 1],
    queryFn: () =>
      fetchNotes({
        page: 1,
        search: "",
        tag: tag === "All" ? undefined : tag,
      }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
