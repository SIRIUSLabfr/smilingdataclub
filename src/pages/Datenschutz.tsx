import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FooterSection from "@/components/FooterSection";

const Datenschutz = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-mono text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-10 font-['Press_Start_2P'] text-primary leading-relaxed">
          Datenschutzerklärung
        </h1>

        <div className="space-y-8 text-foreground/90 text-sm leading-relaxed">
          <Section title="1. Verantwortlicher">
            <p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
            <p className="mt-2">
              <strong className="text-foreground">SIRIUS GmbH document solutions</strong>
              <br />
              Abrichstraße 23
              <br />
              79108 Freiburg-Hochdorf
            </p>
            <p className="mt-2">
              Telefon: (0761) 704070
              <br />
              E-Mail: info@sirius-gmbh.de
            </p>
            <p className="mt-2">
              Vertretungsberechtigte Geschäftsführer: Fabian Schüler, Michael Wangerowski, Manfred
              Schüler
            </p>
          </Section>

          <Section title="2. Allgemeines zur Datenverarbeitung">
            <p>
              Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies
              zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen
              erforderlich ist. Rechtsgrundlagen sind insbesondere:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
              <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung / vorvertragliche Maßnahmen)</li>
              <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</li>
            </ul>
          </Section>

          <Section title="3. Hosting">
            <p>
              Diese Website wird bei Netlify, Inc. (44 Montgomery Street, Suite 300, San Francisco,
              CA 94104, USA) gehostet. Beim Aufruf unserer Website werden durch den
              Hosting-Anbieter automatisch Informationen erfasst (sog. Server-Log-Dateien). Dazu
              gehören:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Browsertyp und -version</li>
              <li>Verwendetes Betriebssystem</li>
              <li>Referrer-URL</li>
              <li>IP-Adresse des zugreifenden Rechners (ggf. anonymisiert)</li>
              <li>Uhrzeit der Serveranfrage</li>
            </ul>
            <p className="mt-2">
              Die Verarbeitung erfolgt auf Grundlage unseres berechtigten Interesses an einer
              sicheren und effizienten Bereitstellung unserer Website (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
            <p className="mt-2">
              Da Netlify seinen Sitz in den USA hat, kann eine Übermittlung personenbezogener Daten
              in die USA erfolgen. Netlify hat sich dem EU-U.S. Data Privacy Framework
              angeschlossen. Ergänzend werden EU-Standardvertragsklauseln (Standard Contractual
              Clauses, SCCs) gemäß Art. 46 Abs. 2 lit. c DSGVO eingesetzt.
            </p>
            <p className="mt-2">
              Weitere Informationen:{" "}
              <a
                href="https://www.netlify.com/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://www.netlify.com/privacy/
              </a>
            </p>
          </Section>

          <Section title="4. Kontaktformular">
            <p>
              Wenn Sie uns über das Kontaktformular auf unserer Website Anfragen zukommen lassen,
              werden Ihre Angaben aus dem Formular (z. B. Name, E-Mail-Adresse, Nachricht) zur
              Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
            </p>
            <p className="mt-2">
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche
              Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
              Beantwortung Ihrer Anfrage).
            </p>
            <p className="mt-2">
              Die übermittelten Daten werden im CRM-System Zoho CRM (Zoho Corporation B.V.,
              Beneluxlaan 4B, 3527 HS Utrecht, Niederlande) verarbeitet. Zoho betreibt Rechenzentren
              in der EU (u. a. in den Niederlanden und Irland).
            </p>
            <p className="mt-2">
              Weitere Informationen:{" "}
              <a
                href="https://www.zoho.com/de/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://www.zoho.com/de/privacy.html
              </a>
            </p>
            <p className="mt-2">
              Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung
              nicht mehr erforderlich sind — in der Regel nach abschließender Bearbeitung Ihrer
              Anfrage, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
          </Section>

          <Section title="5. Webanalyse">
            <p>
              Zur Analyse des Nutzungsverhaltens setzen wir Zoho Marketing Automation (Websitetracking) ein. Dabei können folgende Daten erhoben werden:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Seitenaufrufe und Verweildauer</li>
              <li>Gerätetyp, Bildschirmauflösung</li>
              <li>Ungefährer Standort (auf Basis der IP-Adresse)</li>
              <li>Referrer (verweisende Seite)</li>
              <li>Interaktionen mit E-Mails (Öffnungen, Klicks)</li>
            </ul>
            <p className="mt-2">
              Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a
              DSGVO), die Sie über unser Cookie-Banner erteilen können. Sie können Ihre Einwilligung
              jederzeit mit Wirkung für die Zukunft widerrufen.
            </p>
            <p className="mt-2">
              Die Daten werden bei der Zoho Corporation B.V. in der EU verarbeitet.
            </p>
          </Section>

          <Section title="6. Cookies">
            <p>
              Diese Website verwendet Cookies. Technisch notwendige Cookies werden auf Grundlage von
              Art. 6 Abs. 1 lit. f DSGVO gesetzt. Für das Websitetracking setzt Zoho Marketing
              Automation ein Cookie (zsiq), das Besucher sitzungsübergreifend identifiziert — dieses
              Cookie wird nur mit Ihrer Einwilligung gesetzt (Art. 6 Abs. 1 lit. a DSGVO) und kann
              über das Cookie-Banner verwaltet werden.
            </p>
            <p className="mt-2">
              Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert
              werden und Cookies nur im Einzelfall erlauben, das Annehmen von Cookies für bestimmte
              Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim
              Schließen des Browsers aktivieren. Bei der Deaktivierung von Cookies kann die
              Funktionalität dieser Website eingeschränkt sein.
            </p>
          </Section>

          <Section title="7. SSL-/TLS-Verschlüsselung">
            <p>
              Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine
              verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von
              „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
          </Section>

          <Section title="8. Ihre Rechte als betroffene Person">
            <p>Ihnen stehen folgende Rechte gegenüber dem Verantwortlichen zu:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>
                Auskunftsrecht (Art. 15 DSGVO) — Sie können Auskunft über Ihre bei uns gespeicherten
                personenbezogenen Daten verlangen.
              </li>
              <li>
                Recht auf Berichtigung (Art. 16 DSGVO) — Sie können die Berichtigung unrichtiger
                Daten verlangen.
              </li>
              <li>
                Recht auf Löschung (Art. 17 DSGVO) — Sie können die Löschung Ihrer Daten verlangen,
                sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
              </li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>
                Widerspruchsrecht (Art. 21 DSGVO) — Sie können der Verarbeitung Ihrer Daten
                jederzeit widersprechen, soweit die Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO
                beruht.
              </li>
              <li>
                Recht auf Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO) — Sie können
                erteilte Einwilligungen jederzeit mit Wirkung für die Zukunft widerrufen.
              </li>
            </ul>
            <p className="mt-2">
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: info@sirius-gmbh.de
            </p>
          </Section>

          <Section title="9. Beschwerderecht bei einer Aufsichtsbehörde">
            <p>
              Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen
              die DSGVO verstößt, haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
              zu beschweren.
            </p>
            <p className="mt-3">Zuständige Aufsichtsbehörde:</p>
            <p className="mt-2">
              Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
              Baden-Württemberg
              <br />
              Lautenschlagerstraße 20
              <br />
              70173 Stuttgart
              <br />
              <a
                href="https://www.baden-wuerttemberg.datenschutz.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://www.baden-wuerttemberg.datenschutz.de
              </a>
            </p>
          </Section>

          <Section title="10. Änderung dieser Datenschutzerklärung">
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den
              aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen
              umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
            </p>
            <p className="mt-2 text-muted-foreground">Stand: März 2026</p>
          </Section>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h2 className="text-lg font-semibold text-secondary mb-3">{title}</h2>
    {children}
  </section>
);

export default Datenschutz;
