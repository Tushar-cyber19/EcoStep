type InfoCardProps = {
  title: string;
  description: string;
};

export default function InfoCard({
  title,
  description,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-xl font-semibold">
        {title}
      </h3>

      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}