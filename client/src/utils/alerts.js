import Swal from "sweetalert2";

// One look for every pop-up in the app (replaces window.alert / window.confirm)
const base = Swal.mixin({
  confirmButtonColor: "#198754",
  cancelButtonColor: "#6c757d",
  reverseButtons: true,
});

export const showSuccess = (title, text) => base.fire({ icon: "success", title, text, timer: 2200, showConfirmButton: false });

export const showError = (text, title = "Something went wrong") => base.fire({ icon: "error", title, text });

export const showInfo = (title, text) => base.fire({ icon: "info", title, text });

// Resolves to true when the user confirms
export const confirmAction = async ({ title, text, confirmText = "Yes", cancelText = "Go back", danger = false }) => {
  const result = await base.fire({
    icon: danger ? "warning" : "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: danger ? "#dc3545" : "#198754",
  });
  return result.isConfirmed;
};

// Asks for a text value (e.g. a rejection reason); resolves to the text or null
export const askText = async ({ title, text, placeholder, confirmText = "Submit", inputType = "text", danger = false }) => {
  const result = await base.fire({
    title,
    text,
    input: inputType,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText: confirmText,
    confirmButtonColor: danger ? "#dc3545" : "#198754",
    inputValidator: (value) => (!value?.trim() ? "This field is required" : undefined),
  });
  return result.isConfirmed ? result.value.trim() : null;
};

// Message text from an API error response
export const apiError = (err, fallback) => err?.response?.data?.message || fallback;
