import { RouteState, StateLink } from "../components/RouteState";

export default function ProjectNotFound() {
  return (
    <RouteState
      code="404"
      eyebrow="project not found"
      title="That project isn’t available."
      description="The project may have moved or the link may be incomplete. The full project collection is still available."
    >
      <StateLink href="/projects" primary>
        Browse projects
      </StateLink>
      <StateLink href="/">Back to home</StateLink>
    </RouteState>
  );
}
