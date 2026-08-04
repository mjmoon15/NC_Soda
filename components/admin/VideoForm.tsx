"use client";

import type { VideoAccess, VideoCategory } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import {
  DemoSubmitNotice,
  FormShell,
  useEntityForm,
  type Errors,
} from "./EntityForm";
import { Field, SelectInput, TextArea, TextInput } from "./fields";

export interface VideoFormValues {
  title: string;
  category: VideoCategory;
  access: VideoAccess;
  youtubeId: string;
  storagePath: string;
  durationSeconds: string;
  description: string;
}

const CATEGORY_OPTIONS: { value: VideoCategory; label: string }[] = [
  { value: "brand", label: "Brand" },
  { value: "product", label: "Product" },
  { value: "training", label: "Training" },
];

const ACCESS_OPTIONS: { value: VideoAccess; label: string }[] = [
  { value: "public", label: "Public (YouTube)" },
  { value: "rep", label: "Rep-gated (Storage)" },
];

const EMPTY: VideoFormValues = {
  title: "",
  category: "brand",
  access: "public",
  youtubeId: "",
  storagePath: "",
  durationSeconds: "",
  description: "",
};

/** Standard 11-char YouTube video id. */
const YT_RE = /^[A-Za-z0-9_-]{11}$/;

export function validateVideo(v: VideoFormValues): Errors<VideoFormValues> {
  const e: Errors<VideoFormValues> = {};
  if (!v.title.trim()) e.title = "Title is required.";

  // Public videos play from YouTube; gated videos stream from Storage. Require
  // the matching source for the chosen access level.
  if (v.access === "public") {
    if (!v.youtubeId.trim())
      e.youtubeId = "Public videos need a YouTube ID.";
    else if (!YT_RE.test(v.youtubeId.trim()))
      e.youtubeId = "That doesn't look like an 11-character YouTube ID.";
  } else {
    if (!v.storagePath.trim())
      e.storagePath = "Rep-gated videos need a storage path.";
  }

  if (v.durationSeconds.trim()) {
    const n = Number(v.durationSeconds);
    if (!Number.isInteger(n) || n <= 0)
      e.durationSeconds = "Enter the length in whole seconds.";
  }

  return e;
}

export function VideoForm({ onCancel }: { onCancel?: () => void }) {
  const { values, errors, submitted, setField, handleSubmit } =
    useEntityForm<VideoFormValues>({
      initial: EMPTY,
      validate: validateVideo,
    });

  const isPublic = values.access === "public";

  return (
    <FormShell
      onSubmit={handleSubmit}
      notice={submitted ? <DemoSubmitNotice entity="video" /> : null}
      actions={
        <>
          <Button type="submit" variant="primary">
            Add video
          </Button>
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </>
      }
    >
      <Field id="v-title" label="Title" error={errors.title} full>
        <TextInput
          id="v-title"
          name="title"
          value={values.title}
          onChange={(v) => setField("title", v)}
          error={errors.title}
          placeholder="Our Story: From Garage to Grocery"
        />
      </Field>

      <Field id="v-category" label="Category">
        <SelectInput
          id="v-category"
          name="category"
          value={values.category}
          onChange={(v) => setField("category", v as VideoCategory)}
          options={CATEGORY_OPTIONS}
        />
      </Field>

      <Field id="v-access" label="Access">
        <SelectInput
          id="v-access"
          name="access"
          value={values.access}
          onChange={(v) => setField("access", v as VideoAccess)}
          options={ACCESS_OPTIONS}
        />
      </Field>

      {isPublic ? (
        <Field id="v-youtube" label="YouTube ID" error={errors.youtubeId}>
          <TextInput
            id="v-youtube"
            name="youtubeId"
            value={values.youtubeId}
            onChange={(v) => setField("youtubeId", v)}
            error={errors.youtubeId}
            placeholder="ScMzIvxBSi4"
          />
        </Field>
      ) : (
        <Field
          id="v-storage"
          label="Storage path"
          error={errors.storagePath}
        >
          <TextInput
            id="v-storage"
            name="storagePath"
            value={values.storagePath}
            onChange={(v) => setField("storagePath", v)}
            error={errors.storagePath}
            placeholder="training/cooler-set-walkthrough.mp4"
          />
        </Field>
      )}

      <Field
        id="v-duration"
        label="Duration (seconds)"
        error={errors.durationSeconds}
      >
        <TextInput
          id="v-duration"
          name="durationSeconds"
          type="number"
          value={values.durationSeconds}
          onChange={(v) => setField("durationSeconds", v)}
          error={errors.durationSeconds}
          placeholder="132"
        />
      </Field>

      <Field id="v-description" label="Description" full>
        <TextArea
          id="v-description"
          name="description"
          value={values.description}
          onChange={(v) => setField("description", v)}
          rows={3}
          placeholder="How two brothers turned a backyard rig into a craft soda label…"
        />
      </Field>
    </FormShell>
  );
}
