import { Component, type ReactNode } from 'react';
import './ErrorBoundary.css';
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <div className="eb"><h2>Something went wrong</h2><p>This view failed to load. Reload the page to try again.</p><button onClick={() => location.reload()}>Reload</button></div>
      : this.props.children;
  }
}
