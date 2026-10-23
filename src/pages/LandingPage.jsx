import { createElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  Compass,
  Map,
} from "lucide-react";
import axios from "axios";
import Logo from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";

const productSteps = [
  {
    number: "01",
    title: "Share your starting point",
    description:
      "Add your background, interests, skills, and the kind of work you want to explore.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Explore a career direction",
    description:
      "DreamRoute uses your profile to generate a career path you can review and revisit.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Take the next step",
    description:
      "Work through roadmap steps, track progress, and explore courses in one place.",
    icon: Map,
  },
];

const productFeatures = [
  {
    title: "Career paths shaped around you",
    description:
      "Build a profile around your goals and interests, then explore the career direction generated for you.",
    icon: BrainCircuit,
  },
  {
    title: "A roadmap you can follow",
    description:
      "Review learning steps, update their status, and keep track of your progress as you go.",
    icon: Map,
  },
  {
    title: "Courses from listed institutions",
    description:
      "Browse available courses and narrow the list by details such as institution, duration, and price.",
    icon: BookOpen,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setSubmitStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await axios.post(
        "http://localhost:5001/api/contact/send",
        formData,
      );
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-md"
            aria-label="DreamRoute home"
          >
            <img src={Logo} alt="" className="h-9 w-9 object-contain" />
            <span className="text-lg font-bold tracking-tight">
              Dream<span className="text-primary">Route</span>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex"
          >
            <a className="transition-colors hover:text-foreground" href="#how-it-works">
              How it works
            </a>
            <a className="transition-colors hover:text-foreground" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-foreground" href="#institutions">
              Institutions
            </a>
            <a className="transition-colors hover:text-foreground" href="#contact">
              Contact
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden rounded-md px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get started <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <nav
          aria-label="Mobile navigation"
          className="flex flex-wrap gap-x-5 gap-y-1 border-t border-border px-4 py-2 text-xs font-medium text-muted-foreground md:hidden sm:px-6"
        >
          <a className="shrink-0 py-1 hover:text-foreground" href="#how-it-works">
            How it works
          </a>
          <a className="shrink-0 py-1 hover:text-foreground" href="#features">
            Features
          </a>
          <a className="shrink-0 py-1 hover:text-foreground" href="#institutions">
            Institutions
          </a>
          <a className="shrink-0 py-1 hover:text-foreground" href="#contact">
            Contact
          </a>
          <Link className="shrink-0 py-1 hover:text-foreground sm:hidden" to="/login">
            Sign in
          </Link>
        </nav>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-border bg-card">
          <div
            aria-hidden="true"
            className="absolute -right-36 -top-48 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/70 blur-3xl"
          />
          <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-24">
            <div className="min-w-0 max-w-2xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground">
                <Compass aria-hidden="true" className="h-4 w-4 text-primary" />
                Career guidance, made personal
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Find a direction.
                <span className="block text-primary">Build your next step.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Bring your interests and goals together in a career path you can
                explore, turn into a roadmap, and follow at your own pace.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Create your account
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  See how it works
                  <ArrowDown aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                Start by creating an account and completing your career profile.
              </p>
            </div>

            <div
              role="img"
              aria-label="Illustration of a career profile, roadmap, and course discovery"
              className="relative mx-auto min-w-0 w-full max-w-lg"
            >
              <div className="absolute -left-5 top-12 h-24 w-24 rounded-full border border-primary/10" />
              <div className="absolute -bottom-6 right-3 h-32 w-32 rounded-full border border-primary/10" />
              <div className="relative space-y-4 rounded-2xl border border-border bg-background p-4 shadow-xl shadow-slate-900/5 sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Your career journey
                    </p>
                    <p className="mt-1 text-lg font-semibold">A path to explore</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                    <Compass aria-hidden="true" className="h-5 w-5" />
                  </span>
                </div>

                <ol className="space-y-3">
                  <li className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                      <Check aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-muted-foreground">Start with</span>
                      <span className="block truncate text-sm font-semibold">Your profile and goals</span>
                    </span>
                  </li>
                  <li className="ml-7 h-4 border-l-2 border-dashed border-primary/30" aria-hidden="true" />
                  <li className="flex items-center gap-3 rounded-lg border border-primary/25 bg-accent/50 p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Map aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-muted-foreground">Explore</span>
                      <span className="block truncate text-sm font-semibold">A generated career roadmap</span>
                    </span>
                  </li>
                  <li className="ml-7 h-4 border-l-2 border-dashed border-primary/30" aria-hidden="true" />
                  <li className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      <BookOpen aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-muted-foreground">Continue with</span>
                      <span className="block truncate text-sm font-semibold">Progress and course discovery</span>
                    </span>
                  </li>
                </ol>
                <p className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                  Your next steps depend on the profile and roadmap you create.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-24 border-b border-border bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                A clear place to begin
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                From your goals to a plan you can follow
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                DreamRoute brings profile setup, career exploration, roadmap
                progress, and course discovery into one connected workflow.
              </p>
            </div>

            <ol className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-3 md:gap-10">
              {productSteps.map(({ number, title, description, icon: Icon }) => (
                <li key={number} className="relative min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums text-primary">
                      {number}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                    {createElement(Icon, {
                      "aria-hidden": "true",
                      className: "h-5 w-5 text-primary",
                    })}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-24 border-b border-border bg-card px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Designed around your journey
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  The tools to keep moving
                </h2>
              </div>
              <Link
                to="/signup"
                className="inline-flex min-h-10 items-center gap-2 self-start rounded-md px-1 text-sm font-semibold text-primary hover:underline sm:self-auto"
              >
                Get started <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <ul className="mt-10 divide-y divide-border border-y border-border">
              {productFeatures.map(({ title, description, icon: Icon }) => (
                <li
                  key={title}
                  className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr] sm:gap-5 sm:py-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary">
                    {createElement(Icon, {
                      "aria-hidden": "true",
                      className: "h-5 w-5",
                    })}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="institutions"
          className="scroll-mt-24 border-b border-border bg-brand-slate px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8 dark:bg-brand-deep"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-200">
                For education providers
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Make your courses easier to discover.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base">
                Institutions can request to join DreamRoute and manage the
                courses listed for their organisation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/institution/requests")}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-deep transition-colors hover:bg-slate-100"
            >
              Apply as an institution
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section
          id="contact"
          className="scroll-mt-24 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Get in touch
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Have a question?
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                Send the DreamRoute team a message and we’ll get back to you.
                Fields marked as required need to be completed.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-sm font-medium">
                    Name <span aria-hidden="true" className="text-error">*</span>
                  </label>
                  <input
                    id="contact-name"
                    autoComplete="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium">
                    Email <span aria-hidden="true" className="text-error">*</span>
                  </label>
                  <input
                    id="contact-email"
                    autoComplete="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-phone" className="text-sm font-medium">
                  Phone <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="contact-phone"
                  autoComplete="tel"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-sm font-medium">
                  Message <span aria-hidden="true" className="text-error">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <label className="flex items-start gap-3 text-sm leading-5 text-muted-foreground">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span>I agree to be contacted about this enquiry.</span>
              </label>

              <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending message…" : "Send message"}
                  {!isSubmitting && (
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
                <p
                  aria-live="polite"
                  role={submitStatus === "error" ? "alert" : "status"}
                  className={`text-sm ${
                    submitStatus === "success"
                      ? "text-success"
                      : submitStatus === "error"
                        ? "text-error"
                        : "text-muted-foreground"
                  }`}
                >
                  {submitStatus === "success" &&
                    "Your message has been sent successfully."}
                  {submitStatus === "error" &&
                    "We couldn’t send your message. Please try again."}
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 self-start rounded-md"
            aria-label="DreamRoute home"
          >
            <img src={Logo} alt="" className="h-7 w-7 object-contain" />
            <span className="text-sm font-semibold">
              Dream<span className="text-primary">Route</span>
            </span>
          </Link>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <a className="hover:text-foreground" href="#how-it-works">How it works</a>
            <a className="hover:text-foreground" href="#contact">Contact</a>
            <Link className="hover:text-foreground" to="/login">Sign in</Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DreamRoute
          </p>
        </div>
      </footer>
    </div>
  );
}
