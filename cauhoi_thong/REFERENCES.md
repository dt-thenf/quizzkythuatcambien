# Tài liệu đối chiếu – CDM7160

Câu hỏi về CDM7160 trong ngân hàng này được kiểm tra với tài liệu kỹ thuật của Figaro Engineering:

1. [CDM7160-C00, Rev. 03/18](https://www.figaro.co.jp/en/product/docs/cdm7160-c00_product%20infomation%28en%29_rev00.pdf): dải đo CO₂ 300–5.000 ppm; độ chính xác ±(50 ppm + 3% giá trị đo); chu kỳ đo 2 giây; hoạt động NDIR; độ ẩm 0–85% RH, không ngưng tụ; ứng dụng giám sát không khí trong nhà.
2. [CDM7160-C00, Rev. 05/19](https://www.figaro.co.jp/en/product/docs/cdm7160-c00_product%20infomation%28en%29_rev02.pdf): dải đo CO₂ 360–5.000 ppm; T90 = 90 giây; hai detector hồng ngoại; chu kỳ đo 2 giây; sai số ±(50 ppm + 3% giá trị đo).

**Lưu ý phiên bản**: Câu trắc nghiệm về dải đo chỉ cho lựa chọn `300–5000 ppm` (theo Rev. 03/18), dù Rev. 05/19 đã thay ngưỡng dưới thành 360 ppm. Chỉ chọn theo các phương án đề cung cấp, không tự sửa nội dung câu hỏi.

Tại 2.000 ppm, giới hạn sai số theo công thức datasheet: ±(50 + 3% × 2.000) = **±110 ppm**.

Câu hỏi về độ ẩm 90% RH kèm ngưng tụ nằm ngoài giới hạn vận hành được nhà sản xuất công bố; có nguy cơ lỗi hoặc hỏng cảm biến.
