// /app/admin/payment/page.tsx
"use client";

import { useState, useTransition } from "react";
import { createPaymentPage } from "@/lib/actions";

export default function PaymentPageManager() {
  const [preview, setPreview] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [successUrl, setSuccessUrl] = useState("");
  const [cancelUrl, setCancelUrl] = useState("");
  const [customFields, setCustomFields] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();

  const handleAddCustomField = () => setCustomFields([...customFields, ""]);

  const handleSubmit = () => {
    startTransition(async () => {
      const response = await createPaymentPage({
        title,
        description,
        amount,
        currency,
        successUrl,
        cancelUrl,
        customFields,
      });

      if (response.success) {
        alert("Payment page saved successfully!");
        setPreview(true); // Enable preview mode after saving
      } else {
        alert(response.error || "Failed to save payment page.");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {preview ? "Payment Page Preview" : "Create/Modify Payment Page"}
        </h1>
        <button
          onClick={() => setPreview(!preview)}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          {preview ? "Edit Page" : "Preview Page"}
        </button>
      </div>

      {preview ? (
        <div>
          {/* Payment Page Display */}
          <h1 className="text-3xl font-bold mb-4">{title || "Title"}</h1>
          <p className="mb-4">{description || "Description goes here."}</p>
          <p className="text-lg font-semibold mb-4">
            {currency} {amount || "0.00"}
          </p>
          <form action="/checkout" method="POST" className="space-y-4">
            {customFields.map((field, index) => (
              <input
                key={index}
                type="text"
                name={field}
                placeholder={field}
                className="w-full px-4 py-2 border rounded-md"
              />
            ))}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Pay Now
            </button>
          </form>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          ></textarea>
          <div className="flex space-x-4">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-1/2 px-4 py-2 border rounded-md"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded-md"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <input
            type="url"
            placeholder="Success URL"
            value={successUrl}
            onChange={(e) => setSuccessUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="url"
            placeholder="Cancel URL"
            value={cancelUrl}
            onChange={(e) => setCancelUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          {customFields.map((field, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Custom Field ${index + 1}`}
              value={field}
              onChange={(e) =>
                setCustomFields(
                  customFields.map((f, i) => (i === index ? e.target.value : f))
                )
              }
              className="w-full px-4 py-2 border rounded-md"
            />
          ))}
          <button
            type="button"
            onClick={handleAddCustomField}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Add Custom Field
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Page"}
          </button>
        </form>
      )}
    </div>
  );
}
