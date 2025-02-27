const Forbidden403 = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-red-500">403</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                Forbidden
            </h2>
            <p className="text-gray-600 mt-2">
                Bạn không có quyền truy cập vào trang này.
            </p>
            <a
                href="/"
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Quay về trang chủ
            </a>
        </div>
    );
};

export default Forbidden403;
