import { companyService } from "@/services/company.service";
import { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
}

// export async function generateMetadata({
//   params,
// }: LayoutProps): Promise<Metadata> {
//   const { companyId } = await params;

//   // You can fetch company data here for more specific metadata
//   const companyDisplayName = decodeURIComponent(companyId).replace(
//     /[-_]/g,
//     " "
//   );

//   return {
//     title: `Apply to ${companyDisplayName} | CV Application Form`,
//     description: `Submit your application to join ${companyDisplayName}. Fill out our simple application form to get started with your career opportunity.`,
//     openGraph: {
//       title: `Apply to ${companyDisplayName}`,
//       description: `Submit your application to join ${companyDisplayName}. Fill out our simple application form to get started.`,
//       type: "website",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: `Apply to ${companyDisplayName}`,
//       description: `Submit your application to join ${companyDisplayName}.`,
//     },
//   };
// }

export default function CompanyLayout({ children }: LayoutProps) {
  return children;
}
