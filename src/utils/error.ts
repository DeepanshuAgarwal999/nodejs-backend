export default function handleError(err: Error | any | null): void {
  if (err) {
    console.log(err.message);
  } else {
    console.log("No error occurred");
  }
}
