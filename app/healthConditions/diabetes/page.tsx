export default function Diabetes() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-gray-800 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">Diabetes: Understanding Types, Symptoms & Management</h1>

      <p className="mb-4">
        Diabetes is a chronic condition where the body struggles to regulate blood
        sugar. It occurs when the body doesn’t produce enough insulin or cannot
        use it properly.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Types of Diabetes</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Type 1 Diabetes – autoimmune condition; the body stops producing insulin</li>
        <li>Type 2 Diabetes – the body becomes resistant to insulin; most common</li>
        <li>Gestational Diabetes – occurs during pregnancy</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Symptoms</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Increased thirst</li>
        <li>Frequent urination</li>
        <li>Fatigue</li>
        <li>Slow wound healing</li>
        <li>Blurred vision</li>
        <li>Sudden weight changes</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Management</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Monitor blood sugar regularly</li>
        <li>Eat a balanced diet low in refined sugars</li>
        <li>Exercise regularly</li>
        <li>Maintain a healthy weight</li>
        <li>Use prescribed medications or insulin therapy</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Complications</h2>
      <p>
        If uncontrolled, diabetes can lead to heart disease, kidney damage, nerve
        problems, and vision loss—making consistent management essential.
      </p>
    </div>
  );
}
