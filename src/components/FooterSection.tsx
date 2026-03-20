import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <footer className="py-10 px-6 border-t border-border/30 text-center">
      <p className="text-muted-foreground text-xs">
        A <span className="text-foreground/70">Sirius GmbH</span> brand
      </p>
      <div className="flex items-center justify-center gap-4 mt-3">
        <Link to="/impressum" className="text-muted-foreground/70 hover:text-primary text-xs transition-colors">
          Impressum
        </Link>
        <span className="text-muted-foreground/30">|</span>
        <Link to="/datenschutz" className="text-muted-foreground/70 hover:text-primary text-xs transition-colors">
          Datenschutz
        </Link>
      </div>
      <p className="text-muted-foreground/50 text-xs mt-3">
        © {new Date().getFullYear()} Smiling Data Club. All rights reserved.
      </p>
    </footer>
  );
};

export default FooterSection;
