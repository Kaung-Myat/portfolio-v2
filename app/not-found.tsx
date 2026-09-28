import { RouteState, StateLink } from "./components/RouteState";

export default function NotFound() {
  return (
    <RouteState
      code="404"
      eyebrow="page not found"
      title="This route doesn’t exist."
      description="The link may be outdated, or the page may have moved. You can head home or continue exploring my work."
    >
      <StateLink href="/" primary>
        Back to home
      </StateLink>
      <StateLink href="/projects">View projects</StateLink>
    </RouteState>
  );
}
