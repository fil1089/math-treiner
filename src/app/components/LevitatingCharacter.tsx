import { CharacterSVG } from "./CharacterSVG";

interface LevitatingCharacterProps {
  size?: number;
  showShadowPanel?: boolean;
}

export function LevitatingCharacter({ size = 200, showShadowPanel = false }: LevitatingCharacterProps) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <CharacterSVG size={size} showShadowPanel={showShadowPanel} />
    </div>
  );
}

