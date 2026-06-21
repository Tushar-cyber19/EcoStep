type InfoCardProps = {
  title: string;
  description: string;
};

export default function InfoCard({
  title,
  description,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
      <h3 className="mb-3 text-xl font-semibold text-green-700">
        {title}
      </h3>

      <p className="text-gray-700 whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}