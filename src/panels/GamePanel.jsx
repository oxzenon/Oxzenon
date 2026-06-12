import { Panel } from './Panel.jsx';
import { AsciiHeader } from '../ui/AsciiHeader.jsx';
import { SolCatcher } from '../three/SolCatcher.jsx';

export function GamePanel() {
  return (
    <Panel id="usr/games/catch-sol" chrome="game catch-sol" anchor="game">
      <div className="space-y-8">
        <AsciiHeader
          tag="mini-game"
          title="Catch the SOL"
          kicker="./play — click the floating coins. they get faster the more you grab"
        />
        <SolCatcher />
      </div>
    </Panel>
  );
}
