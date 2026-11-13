# Trắc nghiệm Kỹ thuật cảm biến

Ứng dụng luyện tập giao diện sáng, chạy **ngoại tuyến trong một tệp HTML**. Không cần cài thư viện, chạy máy chủ hay đăng nhập.

## Mở và dùng ngay

1. Clone/pull repo hoặc tải ZIP và giải nén.
2. Mở **[`index.html`](index.html)** bằng Chrome, Edge, Firefox hoặc Safari.
3. Chọn **Quiz Việt**, **Quiz Thông** hoặc **Trộn tất cả** và bắt đầu.

Bạn cũng có thể chép riêng `index.html` sang máy khác: câu hỏi, mã giao diện và cả **25 hình minh họa** đã được nhúng sẵn trong tệp. Không dùng CDN, font mạng hay tải JSON qua `fetch`, nên mở trực tiếp bằng `file://` vẫn hoạt động. Khi đăng lên dịch vụ web tĩnh, chỉ cần phục vụ tệp này.

## Cách luyện tập

- Câu hỏi và vị trí đáp án được xáo trộn khi bắt đầu lượt mới; câu ôn lại tiếp tục đảo vị trí đáp án.
- **Nhấp một đáp án để chấm ngay**. Dù đúng hay sai, ứng dụng luôn hiển thị đáp án đúng.
- Câu sai được chuyển về **cuối hàng chờ**. Câu đó lặp lại đến khi bạn trả lời đúng, kể cả nếu phải làm lại nhiều lần. Câu đã đúng được tính hoàn thành và không lặp lại trong lượt đó.
- Sau khi xem đáp án, **nhấp bất kỳ đâu trên màn hình** để sang câu tiếp; cũng có nút **Câu tiếp**. Thao tác nhấp chọn không đồng thời chuyển câu; nhấp đúp nhanh không bỏ qua phản hồi.
- **Câu trước** mở lại câu đã làm với lựa chọn và phản hồi cũ. Xem lịch sử không đổi điểm, không đưa thêm câu vào hàng chờ và không cho sửa lần trả lời trước. Bấm tiếp để quay về câu đang làm.
- Chỉ hoàn thành sau khi tất cả lượt chọn đều đã được trả lời đúng.
- Tiến độ được tự lưu **riêng cho mỗi chế độ** trên trình duyệt hiện tại. Về trang chọn bộ đề và nhấn **Tiếp tục** để học tiếp. **Lượt mới** hoặc **Bắt đầu lượt mới** thay thế tiến độ chế độ đó và xáo trộn lại.

**Phím tắt:** `1`–`9` chọn đáp án theo vị trí, `Enter`/`Space` hoặc `→` sang câu tiếp sau khi trả lời, `←` về câu trước. Các nút vẫn có thể dùng bằng `Tab` và `Enter` như thông thường. Nhấn `?` ở góc trang để xem hướng dẫn.

> Lưu tiến độ phụ thuộc quyền lưu trữ của trình duyệt, đặc biệt khi mở tệp trực tiếp hoặc dùng chế độ riêng tư. Nếu không lưu được, ứng dụng thông báo và vẫn cho luyện đầy đủ trong tab hiện tại. Tiến độ không tự đồng bộ sang thiết bị/trình duyệt khác. Khi nội dung ngân hàng thay đổi, lượt mới dùng dữ liệu mới và không nạp tiến độ của bộ dữ liệu cũ.

## Toàn bộ câu hỏi được chuyển đổi như thế nào?

| Chế độ | Câu gốc | Lượt chọn sau chuyển đổi |
| --- | ---: | ---: |
| Quiz Việt | 241 | 302 |
| Quiz Thông | 354 | 361 |
| Trộn tất cả | 595 | 663 |

Số lượt chọn lớn hơn số câu gốc vì **mỗi cặp trong câu ghép được tách thành một câu trắc nghiệm riêng**. Mã ngân hàng và mã câu gốc luôn hiện trên câu hỏi; câu ghép còn hiện số phần, ví dụ `C006 · 2/4`.

- **Chọn một:** giữ các lựa chọn và đáp án gốc. Tiền tố `a.`, `b.`… chỉ được bỏ khi hiển thị để không xung đột chữ A/B/C/D sau xáo trộn; dữ liệu nguồn giữ nguyên.
- **Đúng/sai:** vẫn giữ hai lựa chọn đúng/sai theo ngôn ngữ của nguồn.
- **Nhập số:** tạo bốn giá trị để chọn, cùng đơn vị và độ chính xác hiển thị của nguồn nếu có. Giá trị đúng lấy từ `display_answer` hoặc giá trị số gốc; giá trị nhiễu được tạo quanh kết quả đó.
- **Điền khuyết:** giữ nguyên đáp án đúng và bổ sung ba thuật ngữ/giá trị nhiễu được biên soạn tại `src/distractors.json`.
- **Ghép cặp:** mỗi vế trái thành một lượt chọn, các mô tả bên phải thành lựa chọn, giữ đúng từng cặp gốc. Hình của câu gốc đi theo từng phần.
- **Nhiều đáp án:** mỗi lựa chọn là một **tổ hợp phát biểu**. Chỉ tổ hợp có đủ và đúng toàn bộ các ý trong `answer` được tính đúng; chọn bằng một lần nhấp như các câu khác.

Không bỏ câu trùng giữa hai ngân hàng; mã dùng cả tên ngân hàng để phân biệt `viet:C001` với `thong:C001`. Không sửa hay thay thế các tệp câu hỏi gốc, ảnh nguồn hoặc các bảng đáp án đã có.

**Các câu cần rà soát:** ngân hàng Thông đã đánh dấu 27 câu `review_status=needs_review` do thiếu điều kiện, có nhiều phương án hợp lý hoặc khác biệt tài liệu. Ứng dụng giữ đáp án được lưu trong repo đúng theo yêu cầu; sau khi trả lời sẽ hiện rõ “đáp án đúng theo bộ đề”, ghi chú gốc và phương án khác nếu có. Đây là ứng dụng ôn tập theo ngân hàng hiện tại, không xác nhận mọi đáp án là đáp án chính thức của giảng viên.

## Cấu trúc và cập nhật

```text
index.html                 Bản hoàn chỉnh, mở trực tiếp dùng ngay
cauhoi_viet/               241 câu gốc, hình và ảnh chụp nguồn riêng
cauhoi_thong/              354 câu gốc, hình và ảnh chụp nguồn riêng
src/template.html          Khung giao diện
src/styles.css             Giao diện sáng và bố cục điện thoại/máy tính
src/app.js                 Hiển thị, tương tác, lưu tiến độ
src/engine.js              Hàng chờ, lịch sử, chấm và kiểm tra tiến độ
src/convert.mjs            Chuyển mọi dạng câu sang lựa chọn một đáp án
src/distractors.json       Các phương án nhiễu cho câu điền khuyết
scripts/build.mjs          Nhúng dữ liệu, hình, CSS và JS vào index.html
tests/quiz.test.mjs        Kiểm tra tính đầy đủ, đáp án và luồng luyện tập
```

**Chỉ cần Node.js 20 trở lên khi muốn phát triển hoặc cập nhật dữ liệu**; người dùng mở HTML không cần Node.js. Không cần chạy `npm install`.

```sh
node scripts/build.mjs
node --test tests/quiz.test.mjs
```

Tương đương `npm run build` và `npm test`. Sau khi thêm/sửa câu hỏi hoặc hình trong hai ngân hàng, chạy lại build và commit cả `index.html` mới. Nếu thêm một đáp án điền khuyết chưa có, bổ sung ba phương án nhiễu phù hợp vào `src/distractors.json`; quá trình build báo lỗi khi thiếu phương án hoặc thiếu hình, không âm thầm bỏ câu.

## Kiểm tra đã thực hiện

- Đối chiếu đủ 595 câu gốc và từng cặp ghép; đáp án gốc được giữ nguyên.
- Kiểm tra 663 mã lượt chọn riêng biệt, các lựa chọn không trùng và đúng đơn vị/độ chính xác cho câu số.
- Chạy hết ba chế độ với cả các lần trả lời sai, ôn lặp và hoàn thành.
- Kiểm tra quay lại/tiến tới lịch sử, ngăn chấm hai lần, lưu/khôi phục và bỏ qua tiến độ lỗi.
- Kiểm tra HTML có đủ 25 hình nhúng, không cần tài nguyên mạng; mã JavaScript không lỗi cú pháp.
- Kiểm tra thao tác trình duyệt: chọn sai/đúng, hiện đáp án, nhấp ngoài câu để chuyển tiếp, quay lại và khôi phục sau tải lại; kiểm tra bố cục máy tính/điện thoại.
