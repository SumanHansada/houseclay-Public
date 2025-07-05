import { FormikErrors, FormikTouched } from "formik";

/**
 * `useFormikSection` narrows Formik’s `errors` / `touched` objects
 * down to one **nested section** of your form, while keeping
 * strict compile‑time types.
 *
 * Why we need it
 * --------------
 * When a block such as `rentalDetails` is *optional*
 * (`rentalDetails?: RentalDetails`), Formik types the branch as the
 * union:
 *
 *     string | FormikErrors<RentalDetails> | undefined
 *
 * Accessing `errors.rentalDetails.parking` directly therefore fails
 * (“property 'parking' does not exist on type 'string'”).
 *
 * By calling this hook once per component you cast **exactly one**
 * branch to its concrete `FormikErrors<Section>` shape, so the rest
 * of your JSX can access `errors^.parking` safely without repeating
 * `in`‑checks or `getIn`.
 *
 * @param errors   top‑level Formik `errors` object
 * @param touched  top‑level Formik `touched` object
 * @param key      the section key you want to work with
 * @returns        { e, t } – the narrowed `errors` and `touched`
 */
export function useFormikSection<F, K extends keyof F>(
  errors: FormikErrors<F>,
  touched: FormikTouched<F>,
  key: K,
) {
  return {
    errors: errors[key] as FormikErrors<F[K]> | undefined,
    touched: touched[key] as FormikTouched<F[K]> | undefined,
  };
}
