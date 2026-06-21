type Props = {
  logs: any[];
};

export default function RecentLogs({
  logs,
}: Props) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Date
            </th>

            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Electricity (kWh)
            </th>

            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Transport (km)
            </th>

            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Total CO₂ (kg)
            </th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id || index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-800">
                {new Date(
                  log.createdAt?.toDate?.() || log.createdAt
                ).toLocaleDateString()}
              </td>

              <td className="px-4 py-3 text-gray-800">
                {log.details?.electricity || log.electricity || "—"}
              </td>

              <td className="px-4 py-3 text-gray-800">
                {log.details?.carKm || log.transport || "—"}
              </td>

              <td className="px-4 py-3 font-semibold text-green-700">
                {Number(log.totalCO2 || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {logs.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          No calculations found
        </div>
      )}
    </div>
  );
}