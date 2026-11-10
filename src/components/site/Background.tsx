import NeuralCanvas from './NeuralCanvas';

export default function Background() {
  return (
    <>
      <div aria-hidden="true" className="bg-aurora" />
      <div aria-hidden="true" className="bg-grid" />
      <NeuralCanvas />
      <div aria-hidden="true" className="bg-noise" />
    </>
  );
}
