# Vinkling project decisions

## Brand and design

- Product name: **Vinkling**.
- Primary brand color: `#0086D6`; hover color: `#006BAA`.
- Use the global color and font tokens in `app/globals.css` for shared UI styling.
- App typography uses Host Grotesk.

## Login and mobile behavior

- Default country is India (`+91`) and the demo number is `98765 43210`.
- The OTP is four digits, shown in four square input boxes. Do not show the demo code in the UI.
- OTP boxes, country selector, and phone number field are separate reusable components.
- OTP entry supports automatic focus movement, arrow keys, backspace, and pasting a code.
- Keep the OTP Continue button reachable above the mobile keyboard.
- Text inputs and selects use at least 16px text to prevent mobile browser focus zoom.
- The user can return to the phone step with the Change number action.
- The country selector chevron reflects the menu's open state.
- Show distinct empty, incomplete, and incorrect OTP errors; focus the first missing digit.
- Keep digits in their corresponding boxes when users tap out of order or paste a code.
- Keep the OTP Continue button reachable while the mobile keyboard is open.
- The bottom navigation does not include a My Plans item.

## Data and database

- Directory data remains fictional demo data; the default Indian number belongs to the demo member.
- The PostgreSQL/Supabase schema is defined in `supabase/migrations/202610150001_initial_schema.sql`.
- The app does not yet connect to the database; the migration has not been applied.
- Do not display an OTP hint in the interface. Demo login remains local and sends no SMS.
