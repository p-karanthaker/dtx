package uk.ac.aston.dc3010.dtx.timecard;

public enum Status {
  APPROVED(1),
  PENDING(2),
  REJECT(3);

  private final int code;

  Status(int code) {
    this.code = code;
  }

  public int getCode() {
    return code;
  }
}
