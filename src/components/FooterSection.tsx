const FooterSection = () => {
  return (
    <footer className="py-10 px-6 border-t border-border/30 text-center">
      <p className="text-muted-foreground text-xs">
        A <span className="text-foreground/70">Sirius GmbH</span> brand
      </p>
      <p className="text-muted-foreground/50 text-xs mt-2">
        © {new Date().getFullYear()} Smiling Data Club. All rights reserved.
      </p>
    </footer>
  );
};

export default FooterSection;
