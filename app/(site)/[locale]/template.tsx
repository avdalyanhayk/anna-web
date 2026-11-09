import { ViewTransition } from 'react';

/**
 * A template re-mounts on every navigation (a layout does not), so each page
 * enters and exits through this ViewTransition: the old page dims and the new
 * one rises like a curtain (CSS in globals.css; off under reduced motion and in
 * browsers without the View Transitions API). Header, phone bar and the Listen
 * player have their own transition names, so they stay still.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="curtain" exit="curtain" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
