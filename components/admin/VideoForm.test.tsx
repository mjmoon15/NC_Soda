import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { validateVideo, VideoForm, type VideoFormValues } from "./VideoForm";

const publicVideo: VideoFormValues = {
  title: "Our Story",
  category: "brand",
  access: "public",
  youtubeId: "ScMzIvxBSi4",
  storagePath: "",
  durationSeconds: "132",
  description: "",
};

const repVideo: VideoFormValues = {
  title: "Cooler Set Training",
  category: "training",
  access: "rep",
  youtubeId: "",
  storagePath: "training/cooler.mp4",
  durationSeconds: "412",
  description: "",
};

describe("validateVideo", () => {
  it("passes a valid public (YouTube) video", () => {
    expect(validateVideo(publicVideo)).toEqual({});
  });

  it("passes a valid rep-gated (storage) video", () => {
    expect(validateVideo(repVideo)).toEqual({});
  });

  it("requires a title", () => {
    expect(validateVideo({ ...publicVideo, title: "" }).title).toBeTruthy();
  });

  it("requires a YouTube ID for public access and rejects bad ids", () => {
    expect(validateVideo({ ...publicVideo, youtubeId: "" }).youtubeId).toBeTruthy();
    expect(
      validateVideo({ ...publicVideo, youtubeId: "tooshort" }).youtubeId
    ).toBeTruthy();
  });

  it("requires a storage path for rep access", () => {
    expect(
      validateVideo({ ...repVideo, storagePath: "" }).storagePath
    ).toBeTruthy();
  });

  it("does not require a storage path when access is public", () => {
    expect(validateVideo({ ...publicVideo, storagePath: "" })).toEqual({});
  });

  it("rejects a non-integer duration", () => {
    expect(
      validateVideo({ ...publicVideo, durationSeconds: "1.5" }).durationSeconds
    ).toBeTruthy();
  });
});

describe("VideoForm (conditional source field)", () => {
  it("swaps the YouTube field for a storage path when access changes to rep", async () => {
    const user = userEvent.setup();
    render(<VideoForm />);

    expect(screen.getByLabelText(/youtube id/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/storage path/i)).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/access/i), "rep");

    expect(screen.getByLabelText(/storage path/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/youtube id/i)).not.toBeInTheDocument();
  });

  it("confirms with a demo notice on a valid submit", async () => {
    const user = userEvent.setup();
    render(<VideoForm />);

    await user.type(screen.getByLabelText(/title/i), "Our Story");
    await user.type(screen.getByLabelText(/youtube id/i), "ScMzIvxBSi4");
    await user.click(screen.getByRole("button", { name: /add video/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/connect supabase/i);
  });
});
