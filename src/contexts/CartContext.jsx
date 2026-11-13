import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { getWhatsAppNumber } from '../utils/whatsapp'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

const CART_STORAGE_KEY = 'azkaban_cart'
const ORDERS_STORAGE_KEY = 'azkaban_orders'

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.warn('Error reading cart:', e)
      return []
    }
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (e) {
      console.warn('Error saving cart:', e)
    }
  }, [cart])

  const addToCart = (product, quantity = 1, selectedSize = null) => {
    if (!product) return

    // If product has sizes and none selected, pick the first available
    const finalSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Único')
    const cartItemId = `${product.id}-${finalSize}`

    const currentQtyInCart = cart
      .filter((item) => item.product.id === product.id)
      .reduce((sum, item) => sum + item.quantity, 0)

    const availableStock = typeof product.stock === 'number' ? product.stock : 99
    if (availableStock <= currentQtyInCart) {
      toast.error('No hay más stock disponible de este producto', { icon: '⚠️' })
      return
    }

    const qtyToAdd = Math.min(quantity, availableStock - currentQtyInCart)

    setCart((prev) => {
      const idx = prev.findIndex((item) => item.cartItemId === cartItemId)
      if (idx > -1) {
        const copy = [...prev]
        copy[idx].quantity += qtyToAdd
        return copy
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          quantity: qtyToAdd,
          selectedSize: finalSize,
        },
      ]
    })

    toast.success(`¡"${product.name} (Talle: ${finalSize})" sumado al carrito!`, {
      icon: '🛒',
      style: {
        background: '#1a1a1f',
        color: '#fff',
        border: '1px solid #ff5500',
      },
    })
  }

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId))
    toast('Producto eliminado del carrito', { icon: '🗑️' })
  }

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId)
      return
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const maxStock = typeof item.product.stock === 'number' ? item.product.stock : 99
          return { ...item, quantity: Math.min(newQty, maxStock) }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.product.priceOffer || item.product.price || 0
      return sum + price * item.quantity
    }, 0)
  }, [cart])

  const checkoutWhatsApp = (customerData, shippingDetails = null) => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío')
      return
    }

    const {
      name = '',
      phone = '',
      shippingMethod = 'Retiro en persona',
      city = '',
      address = '',
      paymentMethod = 'Transferencia Bancaria',
      notes = '',
    } = customerData

    const shippingPrice = shippingDetails ? (Number(shippingDetails.price) || 0) : 0
    const finalOrderTotal = totalPrice + shippingPrice

    const number = getWhatsAppNumber()

    let message = `¡Hola AzkabanStore! 👋 Quiero realizar el siguiente *PEDIDO* desde la tienda online:\n\n`
    message += `🛍️ *PRODUCTOS SELECCIONADOS:*\n`
    message += `──────────────────────\n`

    cart.forEach((item, index) => {
      const price = item.product.priceOffer || item.product.price || 0
      const subtotal = price * item.quantity
      message += `${index + 1}. *${item.product.name}*\n`
      message += `   📏 Talle: *${item.selectedSize}*\n`
      message += `   📦 Cantidad: ${item.quantity} un.\n`
      message += `   💵 Precio: $${price.toLocaleString('es-AR')}\n`
      message += `   ➡️ Subtotal: $${subtotal.toLocaleString('es-AR')}\n\n`
    })

    message += `──────────────────────\n`
    message += `💵 *SUBTOTAL PRENDAS:* $${totalPrice.toLocaleString('es-AR')} ARS\n`

    if (shippingDetails && shippingDetails.id !== 'pickup') {
      const costText = shippingPrice === 0 ? '¡GRATIS!' : `$${shippingPrice.toLocaleString('es-AR')} ARS`
      message += `🚚 *ENVÍO:* ${shippingDetails.name || shippingMethod} (${costText})\n`
      if (shippingDetails.postalCode) message += `   📍 CP Destino: *${shippingDetails.postalCode}*\n`
      if (shippingDetails.estimatedDays) message += `   ⏱️ Plazo estimado: *${shippingDetails.estimatedDays}*\n`
    } else {
      message += `🚶 *MÉTODO DE ENTREGA:* ${shippingMethod}\n`
    }

    message += `💰 *TOTAL A ABONAR: $${finalOrderTotal.toLocaleString('es-AR')} ARS*\n\n`

    message += `💳 *FORMA DE PAGO:* ${paymentMethod}\n\n`

    message += `👤 *DATOS DEL COMPRADOR:*\n`
    message += `• *Nombre:* ${name}\n`
    if (phone) message += `• *Teléfono/WhatsApp:* ${phone}\n`
    if (shippingMethod !== 'Retiro en persona' && (city || address)) {
      if (city) message += `• *Localidad / CP:* ${city}\n`
      if (address) message += `• *Dirección de Entrega:* ${address}\n`
    }
    if (notes) message += `• *Aclaraciones:* ${notes}\n`

    message += `\n¿Me confirman disponibilidad y los datos para realizar el pago? ¡Muchas gracias!`

    // Log the order in Admin
    try {
      const orderEntry = {
        id: `AZK-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        customer: { name, phone, city, address },
        shippingMethod: shippingDetails?.name || shippingMethod,
        shippingCost: shippingPrice,
        shippingCarrier: shippingDetails?.carrier || 'Andreani',
        postalCode: shippingDetails?.postalCode || '',
        paymentMethod,
        items: cart.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          size: i.selectedSize,
          qty: i.quantity,
          price: i.product.priceOffer || i.product.price,
        })),
        subtotal: totalPrice,
        total: finalOrderTotal,
        status: 'Pendiente',
      }
      const existingOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]')
      existingOrders.unshift(orderEntry)
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existingOrders))
      window.dispatchEvent(new Event('azkaban_orders_updated'))
    } catch (e) {
      console.warn('Error saving order log:', e)
    }

    // Open WhatsApp
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank')
    clearCart()
    setIsOpen(false)
    toast.success('¡Redirigiendo a WhatsApp para confirmar tu pedido!', { icon: '📲' })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        checkoutWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
