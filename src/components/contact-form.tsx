"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { submitContactForm } from "@/app/actions";

interface ContactFormProps {
  showLink?: boolean;
}

export function ContactForm({ showLink = true }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const [isSuccess, setIsSuccess] = React.useState(false);
  const [Message, setMessage] = React.useState("");

  const onSubmit = async (data: any) => {
    // Utiliser la Server Action sécurisée
    const result = await submitContactForm({
      name: data.name,
      email: data.email,
      message: data.message,
    });

    if (result.success) {
      setIsSuccess(true);
      setMessage(result.message);
      reset();
    } else {
      setIsSuccess(false);
      setMessage(result.message);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {!isSubmitSuccessful && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nom *</label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className={`w-full px-4 py-3 border-2 rounded-md outline-none focus:ring-4 transition-colors ${
                      errors.name
                        ? "border-red-600 focus:border-red-600 ring-red-100"
                        : "border-gray-300 focus:border-accent ring-accent/20"
                    }`}
                    {...register("name", {
                      required: "Le nom est requis",
                      maxLength: {
                        value: 80,
                        message: "Le nom ne peut pas dépasser 80 caractères"
                      },
                    })}
                  />
                  {errors.name && (
                    <div className="mt-1 text-red-600">
                      <small>{errors.name.message}</small>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email_address" className="text-sm font-medium">Adresse Email *</label>
                  <input
                    id="email_address"
                    type="email"
                    autoComplete="email"
                    className={`w-full px-4 py-3 border-2 rounded-md outline-none focus:ring-4 transition-colors ${
                      errors.email
                        ? "border-red-600 focus:border-red-600 ring-red-100"
                        : "border-gray-300 focus:border-accent ring-accent/20"
                    }`}
                    {...register("email", {
                      required: "L'email est requis",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Veuillez entrer un email valide",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="mt-1 text-red-600">
                      <small>{errors.email.message}</small>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message *</label>
                <textarea
                  id="message"
                  autoComplete="off"
                  className={`w-full px-4 py-3 border-2 rounded-md outline-none h-36 resize-none focus:ring-4 transition-colors ${
                    errors.message
                      ? "border-red-600 focus:border-red-600 ring-red-100"
                      : "border-gray-300 focus:border-accent ring-accent/20"
                  }`}
                  {...register("message", { required: "Le message est requis" })}
                />
                {errors.message && (
                  <div className="mt-1 text-red-600">
                    {" "}
                    <small>{errors.message.message}</small>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-accent text-black hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </div>
          </form>
        )}

        {isSubmitSuccessful && isSuccess && (
          <div className="flex flex-col items-center justify-center text-center rounded-md bg-green-50 p-6 border border-green-200">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl text-green-600 mb-2">Message envoyé !</h3>
            <p className="text-green-700 mb-4">{Message}</p>
            <Button
              onClick={() => {
                setIsSuccess(false);
                setMessage("");
                reset();
              }}
              variant="outline"
              className="text-accent border-accent hover:bg-accent hover:text-white"
            >
              Envoyer un autre message
            </Button>
          </div>
        )}

        {isSubmitSuccessful && !isSuccess && (
          <div className="flex flex-col items-center justify-center text-center rounded-md bg-red-50 p-6 border border-red-200">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-2xl text-red-600 mb-2">Erreur lors de l'envoi</h3>
            <p className="text-red-700 mb-4">{Message}</p>
            <Button
              onClick={() => {
                setIsSuccess(false);
                setMessage("");
                reset();
              }}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
            >
              Réessayer
            </Button>
          </div>
        )}

        <p className="text-center text-xs text-gray-500 mt-4">
          Formulaire sécurisé par{" "}
          <a
            href="https://web3forms.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Web3Forms
          </a>
        </p>

        {showLink && !isSubmitSuccessful && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Vous pouvez aussi nous contacter directement par email à{" "}
            <a
              href="mailto:contact@glisseetvent.com"
              className="text-accent hover:underline"
            >
              contact@glisseetvent.com
            </a>
          </p>
        )}
      </div>
    </>
  );
}