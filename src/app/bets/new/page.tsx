import NewBetForm from "./NewBetForm";

export default function NewBetPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Make a bet</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Whatever happens, something gets Bettre — you hit your goal, or your stake helps a cause
        you believe in.
      </p>
      <NewBetForm />
    </div>
  );
}
