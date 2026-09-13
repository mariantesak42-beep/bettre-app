import NewBetForm from "./NewBetForm";

export default function NewBetPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-heading text-3xl font-extrabold text-ink">Make a bet</h1>
      <p className="mt-1.5 text-sm font-medium text-ink/70">
        Whatever happens, something gets Bettre — you hit your goal, or your stake helps a cause
        you believe in.
      </p>
      <NewBetForm />
    </div>
  );
}
