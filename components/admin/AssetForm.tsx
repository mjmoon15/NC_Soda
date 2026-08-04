"use client";

import type { AssetType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import {
  DemoSubmitNotice,
  FormShell,
  useEntityForm,
  type Errors,
} from "./EntityForm";
import { Field, SelectInput, TextArea, TextInput } from "./fields";

export interface AssetFormValues {
  title: string;
  type: AssetType;
  fileType: string;
  sizeMb: string;
  productSlug: string;
  description: string;
}

const TYPE_OPTIONS: { value: AssetType; label: string }[] = [
  { value: "sell_sheet", label: "Sell sheet" },
  { value: "pos", label: "POS / merchandising" },
  { value: "spec_sheet", label: "Spec sheet" },
  { value: "logo", label: "Logo / brand" },
];

const FILE_TYPE_OPTIONS = [
  { value: "PDF", label: "PDF" },
  { value: "PNG", label: "PNG" },
  { value: "JPG", label: "JPG" },
  { value: "SVG", label: "SVG" },
  { value: "ZIP", label: "ZIP" },
];

const EMPTY: AssetFormValues = {
  title: "",
  type: "sell_sheet",
  fileType: "PDF",
  sizeMb: "",
  productSlug: "",
  description: "",
};

export function validateAsset(v: AssetFormValues): Errors<AssetFormValues> {
  const e: Errors<AssetFormValues> = {};
  if (!v.title.trim()) e.title = "Title is required.";

  if (!v.sizeMb.trim()) {
    e.sizeMb = "File size is required.";
  } else {
    const n = Number(v.sizeMb);
    if (!Number.isFinite(n) || n <= 0)
      e.sizeMb = "Enter a positive size in MB.";
    else if (n > 500) e.sizeMb = "That's over the 500 MB limit.";
  }

  return e;
}

export function AssetForm({ onCancel }: { onCancel?: () => void }) {
  const { values, errors, submitted, setField, handleSubmit } =
    useEntityForm<AssetFormValues>({
      initial: EMPTY,
      validate: validateAsset,
    });

  return (
    <FormShell
      onSubmit={handleSubmit}
      notice={submitted ? <DemoSubmitNotice entity="asset" /> : null}
      actions={
        <>
          <Button type="submit" variant="primary">
            Upload asset
          </Button>
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </>
      }
    >
      <Field id="a-title" label="Title" error={errors.title} full>
        <TextInput
          id="a-title"
          name="title"
          value={values.title}
          onChange={(v) => setField("title", v)}
          error={errors.title}
          placeholder="Parakey Sell Sheet"
        />
      </Field>

      <Field id="a-type" label="Asset type">
        <SelectInput
          id="a-type"
          name="type"
          value={values.type}
          onChange={(v) => setField("type", v as AssetType)}
          options={TYPE_OPTIONS}
        />
      </Field>

      <Field id="a-filetype" label="File type">
        <SelectInput
          id="a-filetype"
          name="fileType"
          value={values.fileType}
          onChange={(v) => setField("fileType", v)}
          options={FILE_TYPE_OPTIONS}
        />
      </Field>

      <Field id="a-size" label="File size (MB)" error={errors.sizeMb}>
        <TextInput
          id="a-size"
          name="sizeMb"
          type="number"
          value={values.sizeMb}
          onChange={(v) => setField("sizeMb", v)}
          error={errors.sizeMb}
          placeholder="1.4"
        />
      </Field>

      <Field id="a-product" label="Linked product slug (optional)">
        <TextInput
          id="a-product"
          name="productSlug"
          value={values.productSlug}
          onChange={(v) => setField("productSlug", v)}
          placeholder="parakey-key-lime-pie"
        />
      </Field>

      <Field id="a-description" label="Description" full>
        <TextArea
          id="a-description"
          name="description"
          value={values.description}
          onChange={(v) => setField("description", v)}
          rows={3}
          placeholder="One-pager: flavor profile, specs, and shelf talkers."
        />
      </Field>
    </FormShell>
  );
}
