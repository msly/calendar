import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BottomDrawer } from './BottomDrawer';

test('renders an accessible dialog when open', () => {
  render(
    <BottomDrawer isOpen title="冲煞" onClose={() => {}}>
      内容
    </BottomDrawer>,
  );

  expect(screen.getByRole('dialog', { name: '冲煞说明' })).toBeInTheDocument();
  expect(screen.getByText('内容')).toBeInTheDocument();
});

test('calls onClose when the close button is pressed', async () => {
  const user = userEvent.setup();
  const onClose = vi.fn();

  render(
    <BottomDrawer isOpen title="冲煞" onClose={onClose}>
      内容
    </BottomDrawer>,
  );

  await user.click(screen.getByRole('button', { name: '关闭说明' }));

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('moves focus to close button when opened', () => {
  render(
    <BottomDrawer isOpen title="冲煞" onClose={() => {}}>
      <button type="button">次要操作</button>
    </BottomDrawer>,
  );

  expect(screen.getByRole('button', { name: '关闭说明' })).toHaveFocus();
});

test('calls onClose when Escape is pressed', async () => {
  const user = userEvent.setup();
  const onClose = vi.fn();

  render(
    <BottomDrawer isOpen title="冲煞" onClose={onClose}>
      <button type="button">次要操作</button>
    </BottomDrawer>,
  );

  await user.keyboard('{Escape}');

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('traps tab focus inside the drawer', async () => {
  const user = userEvent.setup();
  render(
    <BottomDrawer isOpen title="冲煞" onClose={() => {}}>
      <button type="button">次要操作</button>
    </BottomDrawer>,
  );

  const closeButton = screen.getByRole('button', { name: '关闭说明' });
  const secondaryButton = screen.getByRole('button', { name: '次要操作' });

  expect(closeButton).toHaveFocus();
  await user.tab();
  expect(secondaryButton).toHaveFocus();
  await user.tab();
  expect(closeButton).toHaveFocus();
  await user.tab({ shift: true });
  expect(secondaryButton).toHaveFocus();
});

function DrawerWithTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setIsOpen(true)}>
        打开冲煞说明
      </button>
      <BottomDrawer isOpen={isOpen} title="冲煞" onClose={() => setIsOpen(false)}>
        <button type="button">次要操作</button>
      </BottomDrawer>
    </div>
  );
}

test('restores focus to the trigger when closed', async () => {
  const user = userEvent.setup();
  render(<DrawerWithTrigger />);

  const trigger = screen.getByRole('button', { name: '打开冲煞说明' });
  await user.click(trigger);
  expect(screen.getByRole('button', { name: '关闭说明' })).toHaveFocus();

  await user.click(screen.getByRole('button', { name: '关闭说明' }));

  expect(trigger).toHaveFocus();
});

test('does not render when closed', () => {
  render(
    <BottomDrawer isOpen={false} title="冲煞" onClose={() => {}}>
      内容
    </BottomDrawer>,
  );

  expect(screen.queryByRole('dialog', { name: '冲煞说明' })).not.toBeInTheDocument();
});

test('shows detail CTA driven by explicit href and renders explicit preview content', () => {
  render(
    <BottomDrawer
      isOpen
      title="任意标题"
      onClose={() => {}}
      detailHref="/explain/clash"
      previewContent={<p>短说明</p>}
    >
      <p>长说明</p>
    </BottomDrawer>,
  );

  expect(screen.getByText('短说明')).toBeInTheDocument();
  expect(screen.queryByText('长说明')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: '查看详细说明' })).toHaveAttribute(
    'href',
    '/explain/clash',
  );
});

test('renders full children when detail handoff is not provided', () => {
  render(
    <BottomDrawer
      isOpen
      title="冲煞"
      onClose={() => {}}
      previewContent={<p>短说明</p>}
    >
      <p>长说明</p>
    </BottomDrawer>,
  );

  expect(screen.getByText('长说明')).toBeInTheDocument();
  expect(screen.queryByText('短说明')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '查看详细说明' })).not.toBeInTheDocument();
});

test('treats aria-hidden=false elements as focusable in the tab loop', async () => {
  const user = userEvent.setup();

  render(
    <BottomDrawer isOpen title="冲煞" onClose={() => {}}>
      <button type="button" aria-hidden="false">
        次要操作
      </button>
    </BottomDrawer>,
  );

  await user.tab();

  expect(screen.getByRole('button', { name: '次要操作' })).toHaveFocus();
});
