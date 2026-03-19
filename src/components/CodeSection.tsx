const CodeSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="terminal rounded-lg overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/20">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <div className="w-3 h-3 rounded-full bg-accent" />
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="ml-3 text-xs text-muted-foreground font-mono">smiling-data-club.ts</span>
          </div>

          {/* Code content */}
          <pre className="p-6 text-sm md:text-base leading-relaxed overflow-x-auto">
            <code>
              <span className="text-secondary">if</span> (employee.
              <span className="text-primary">isHappy</span>()) {"{"}{"\n"}
              {"  "}company.<span className="text-primary">grows</span>();{"\n"}
              {"  "}boss.<span className="text-primary">smiles</span>();{"\n"}
              {"  "}data.<span className="text-primary">flows</span>();{"\n"}
              {"}"} <span className="text-secondary">else</span> {"{"}{"\n"}
              {"  "}<span className="text-muted-foreground">// Call Smiling Data Club 😎</span>{"\n"}
              {"  "}sdc.<span className="text-primary">optimize</span>(everything);{"\n"}
              {"}"}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
};

export default CodeSection;
