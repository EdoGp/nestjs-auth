export interface EmailProperties {
  to: string | string[];
  from?: {
    email: string;
    name: string;
  };
  subject: string;
  text?: string;
  html?: string;
}
