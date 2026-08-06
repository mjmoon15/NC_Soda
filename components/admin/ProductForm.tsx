"use client";

import type { ProductCategory } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import {
  DemoSubmitNotice,
  FormShell,
  useEntityForm,
  type Errors,
} from "./EntityForm";
import {
  CheckboxRow,
  Field,
  SelectInput,
  TextArea,
  TextInput,
} from "./fields";

export interface ProductFormValues {
  name: string;
  category: ProductCategory;
  sku: string;
  tagline: string;
  description: string;
  calories: string;
  casePack: string;
  unitVolume: string;
  featured: boolean;
}

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "Craft Soda", label: "Craft Soda" },
  { value: "Sparkling Hopwater", label: "Sparkling Hopwater" },
  { value: "Margarita Mix", label: "Margarita Mix" },
  { value: "Sparkling Botanicals", label: "Sparkling Botanicals" },
];

const EMPTY: ProductFormValues = {
  name: "",
  category: "Craft Soda",
  sku: "",
  tagline: "",
  description: "",
  calories: "",
  casePack: "",
  unitVolume: "",
  featured: false,
};

/** SKU shape used across the seed data, e.g. NCS-CS-001. Kept lenient. */
const SKU_RE = /^[A-Za-z]{2,}-[A-Za-z0-9]{2,}-\d{2,}$/;

export function validateProduct(v: ProductFormValues): Errors<ProductFormValues> {
  const e: Errors<ProductFormValues> = {};
  if (!v.name.trim()) e.name = "Name is required.";
  else if (v.name.trim().length < 2) e.name = "Name is too short.";

  if (!v.sku.trim()) e.sku = "SKU is required.";
  else if (!SKU_RE.test(v.sku.trim()))
    e.sku = "Use the NCS-XX-000 format (e.g. NCS-CS-001).";

  if (!v.tagline.trim()) e.tagline = "Tagline is required.";

  if (v.calories.trim()) {
    const n = Number(v.calories);
    if (!Number.isFinite(n) || n < 0) e.calories = "Enter 0 or a positive number.";
  }

  if (v.casePack.trim()) {
    const n = Number(v.casePack);
    if (!Number.isInteger(n) || n <= 0)
      e.casePack = "Enter a whole number of units per case.";
  }

  return e;
}

export function ProductForm({
  onCancel,
}: {
  onCancel?: () => void;
}) {
  const { values, errors, submitted, setField, handleSubmit } =
    useEntityForm<ProductFormValues>({
      initial: EMPTY,
      validate: validateProduct,
    });

  return (
    <FormShell
      onSubmit={handleSubmit}
      notice={submitted ? <DemoSubmitNotice entity="product" /> : null}
      actions={
        <>
          <Button type="submit" variant="primary">
            Save product
          </Button>
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </>
      }
    >
      <Field id="p-name" label="Product name" error={errors.name}>
        <TextInput
          id="p-name"
          name="name"
          value={values.name}
          onChange={(v) => setField("name", v)}
          error={errors.name}
          placeholder="Parakey"
        />
      </Field>

      <Field id="p-category" label="Category">
        <SelectInput
          id="p-category"
          name="category"
          value={values.category}
          onChange={(v) => setField("category", v as ProductCategory)}
          options={CATEGORY_OPTIONS}
        />
      </Field>

      <Field id="p-sku" label="SKU" error={errors.sku}>
        <TextInput
          id="p-sku"
          name="sku"
          value={values.sku}
          onChange={(v) => setField("sku", v)}
          error={errors.sku}
          placeholder="NCS-CS-001"
        />
      </Field>

      <Field id="p-unit" label="Unit volume">
        <TextInput
          id="p-unit"
          name="unitVolume"
          value={values.unitVolume}
          onChange={(v) => setField("unitVolume", v)}
          placeholder="12 fl oz"
        />
      </Field>

      <Field id="p-calories" label="Calories" error={errors.calories}>
        <TextInput
          id="p-calories"
          name="calories"
          type="number"
          value={values.calories}
          onChange={(v) => setField("calories", v)}
          error={errors.calories}
          placeholder="90"
        />
      </Field>

      <Field id="p-casepack" label="Case pack (units)" error={errors.casePack}>
        <TextInput
          id="p-casepack"
          name="casePack"
          type="number"
          value={values.casePack}
          onChange={(v) => setField("casePack", v)}
          error={errors.casePack}
          placeholder="12"
        />
      </Field>

      <Field id="p-tagline" label="Tagline" error={errors.tagline} full>
        <TextInput
          id="p-tagline"
          name="tagline"
          value={values.tagline}
          onChange={(v) => setField("tagline", v)}
          error={errors.tagline}
          placeholder="Key lime pie in a can, baby."
        />
      </Field>

      <Field id="p-description" label="Description" full>
        <TextArea
          id="p-description"
          name="description"
          value={values.description}
          onChange={(v) => setField("description", v)}
          rows={3}
          placeholder="Bright key lime, a graham-cracker whisper…"
        />
      </Field>

      <div>
        <CheckboxRow
          id="p-featured"
          name="featured"
          checked={values.featured}
          onChange={(c) => setField("featured", c)}
        >
          Feature on the public storefront
        </CheckboxRow>
      </div>
    </FormShell>
  );
}
