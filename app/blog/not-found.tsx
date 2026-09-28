import { RouteState, StateLink } from "../components/RouteState";

export default function BlogNotFound() {
  return (
    <RouteState
      code="404"
      eyebrow="post not found"
      title="That article isn’t here."
      description="It may have been renamed or removed. Browse the writing archive to find another note."
    >
      <StateLink href="/blog" primary>
        Browse all posts
      </StateLink>
      <StateLink href="/">Back to home</StateLink>
    </RouteState>
  );
}
