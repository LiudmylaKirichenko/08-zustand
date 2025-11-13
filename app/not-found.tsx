import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | NoteHub",
  description: "The page you're looking for does not exist on NoteHub.",
  openGraph: {
    title: "404 - Page Not Found | NoteHub",
    description: "The page you're looking for does not exist on NoteHub.",
    url: "https://notehub.com/not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub 404 Page",
      },
    ],
  },
};

const NotFound = () => {
  return (
    <div>
      <div>
        <h1>404 - Page not found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFound;
