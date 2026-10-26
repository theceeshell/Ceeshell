import { startTransition, type FormEvent } from "react";

/**
 * onSubmit handler for a useActionState action. Passing the action to
 * <form action> makes React 19 reset every field once it finishes, which
 * wipes what the visitor typed when the server returns a validation error.
 * Submitting through onSubmit keeps the fields while still using the action.
 */
export function submitKeepingValues(formAction: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };
}
