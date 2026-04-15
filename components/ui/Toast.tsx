import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg rounded-[10px]",
          description: "group-[.toast]:text-slate-500",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white rounded-[10px]",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 rounded-[10px]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
