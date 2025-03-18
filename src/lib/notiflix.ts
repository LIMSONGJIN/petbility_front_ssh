import { Notify, Loading } from "notiflix";

export function showToast(
  message: string,
  type: "success" | "failure" = "success"
) {
  Notify[type](message, {
    position: "right-top",
    timeout: 3000,
  });
}

export function showLoading(message: string = "Loading...") {
  Loading.standard(message);
}

export function hideLoading() {
  Loading.remove();
}
