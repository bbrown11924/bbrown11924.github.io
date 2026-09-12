import MtjSensorDemo from "@/components/research/MtjSensorDemo";

export default function ResearchPage() {
  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Research</h1>
        <p className="max-w-2xl text-gray-600">
          A few interactive figures illustrating the physics behind my work — more to come.
        </p>
      </header>

      <article className="space-y-3">
        <h2 className="text-lg font-semibold">Magnetic tunnel junction sensing</h2>
        <p className="max-w-2xl text-gray-600">
          A magnetic tunnel junction (MTJ) is a stack of two ferromagnetic layers separated by a
          nanometers-thin insulating barrier. One layer's magnetization is pinned in place; the
          other is free to rotate in response to a nearby field. The tunneling resistance across
          the barrier depends on the angle between them — try it below.
        </p>
        <MtjSensorDemo />
      </article>
    </section>
  );
}
